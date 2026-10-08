"""CI smoke test: run the built app in a pseudo-terminal and wait for the
About screen to render. Usage: python3 scripts/smoke-test.py [dist/main.js]"""
import fcntl, os, pty, select, struct, sys, termios, time

EXPECT = b"Hello! I'm Sao Visal"
entry = sys.argv[1] if len(sys.argv) > 1 else "dist/main.js"

# Ink stops rendering live frames when it detects CI (CI, CONTINUOUS_INTEGRATION
# or CI_* variables), so run the app with a non-CI environment like production.
env = {k: v for k, v in os.environ.items() if not (k.startswith("CI_") or k == "CONTINUOUS_INTEGRATION")}
env["CI"] = "false"

pid, fd = pty.fork()
if pid == 0:
    os.execvpe("node", ["node", entry], env)
fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", 30, 110, 0, 0))

out, deadline = b"", time.time() + 10
while time.time() < deadline and EXPECT not in out:
    if select.select([fd], [], [], 0.1)[0]:
        try:
            out += os.read(fd, 65536)
        except OSError:
            break
os.kill(pid, 9)

if EXPECT not in out:
    print(out.decode(errors="replace")[-3000:])
    print("::error::App did not render the About screen")
    sys.exit(1)
print("smoke test passed")

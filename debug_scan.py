
import subprocess
import platform
import json

def debug_scan():
    print(f"Platform: {platform.system()}")
    
    # 1. Netstat
    print("Testing Netstat...")
    try:
        cmd = ['netstat', '-an']
        res = subprocess.run(cmd, capture_output=True, text=True)
        print(f"Netstat return code: {res.returncode}")
        print(f"Netstat stdout len: {len(res.stdout)}")
    except Exception as e:
        print(f"Netstat failed: {e}")

    # 2. Tasklist
    print("Testing Tasklist...")
    try:
        if platform.system() == "Windows":
            cmd = ['tasklist']
        else:
            cmd = ['ps', '-e']
        res = subprocess.run(cmd, capture_output=True, text=True)
        print(f"Tasklist return code: {res.returncode}")
        print(f"Tasklist stdout len: {len(res.stdout)}")
    except Exception as e:
        print(f"Tasklist failed: {e}")
        
    # 3. Import Check
    print("Imports inside function test...")
    try:
        import re
        print("re imported")
    except Exception as e:
        print(f"Import failed: {e}")

if __name__ == "__main__":
    debug_scan()

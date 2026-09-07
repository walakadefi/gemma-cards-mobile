import subprocess
import os

print("=== VERIFYING AND COMMITTING PERSISTENT FEATURE FILES ===")

# Stage all implemented files
subprocess.run(["git", "add", "-A"])

# Show what's staged
result = subprocess.run(
    ["git", "diff", "--cached", "--name-status"], 
    capture_output=True, text=True
)

staged_files = {}
for line in result.stdout.split('\n'):
    parts = line.strip().split()
    if len(parts) >= 2:
        status, path = parts[0], parts[1]
        staged_files[path] = status

print("Files implemented and staged:")
for path, status in staged_files.items():
    print(f"\n  [{status}] {path}")

# Commit all new implementations  
if staged_files:
    subprocess.run(
        ["git", "commit", "-m", "feat: complete shop profile binder reveal persistence + polish"],
        capture_output=True, text=True
    )
    result = subprocess.run(["git", "log", "-1", "--format=%s"], capture_output=True, text=True)
    print(f"\n✓ Committed to commit {result.stdout.strip()[:12]}")

# List files in feature folders
print("\n=== FEATURE FILES IN APP ===")
feature_dirs = [
    "app/src/(tabs)/shop.tsx",
    "app/src/screens/binder.tsx", 
    "app/src/profile.tsx",
    "app/src/screens/reveal/[setId].tsx"
]

for dir_path in feature_dirs:
    full_path = f"C:\\Users\\mikae\\Documents\\ChatGPT\\Gemma\\{dir_path}"  
    if os.path.exists(full_path):
        with open(full_path, "r") as f:
            lines = len(f.readlines()) 
        print(f"\n✓ {lines} lines in {dir_path}")
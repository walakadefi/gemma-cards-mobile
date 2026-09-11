# Manual Publish Instructions
# Copy these steps into PowerShell or CMD and run them

echo ".git add -A"
echo "git commit -m 'feat: publish app updates'"
echo "npx expo build --platform web"
echo "cd .expo/ci && vercel"

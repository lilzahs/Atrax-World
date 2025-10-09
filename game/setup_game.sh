#!/bin/bash

echo "🎮 Setting up Atrax-World Game Integration"
echo "=========================================="

# Check if source directory exists
SOURCE_DIR="/Users/doandothanhdanh/Desktop/zah project/clash-of-clans-clone"
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Source directory not found: $SOURCE_DIR"
    exit 1
fi

# Create game directory
GAME_DIR="/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game"
mkdir -p "$GAME_DIR"

echo "📁 Copying Unity Client..."
cp -r "$SOURCE_DIR/Client" "$GAME_DIR/"

echo "🖥️ Copying Game Server..."
cp -r "$SOURCE_DIR/Server" "$GAME_DIR/"

echo "🗄️ Copying Database..."
cp -r "$SOURCE_DIR/Database" "$GAME_DIR/"

echo "📄 Copying documentation..."
cp "$SOURCE_DIR/README.md" "$GAME_DIR/README_original.md" 2>/dev/null || echo "README.md not found, skipping..."
cp "$SOURCE_DIR/LICENSE" "$GAME_DIR/" 2>/dev/null || echo "LICENSE not found, skipping..."

echo "🧹 Cleaning Git history..."
find "$GAME_DIR" -name ".git" -type d -exec rm -rf {} + 2>/dev/null || true
find "$GAME_DIR" -name ".gitignore" -delete 2>/dev/null || true

echo "✅ Game setup completed!"
echo ""
echo "📍 Game location: $GAME_DIR"
echo ""
echo "Next steps:"
echo "1. cd '/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World'"
echo "2. git add ."
echo "3. git commit -m 'Add Unity game assets'"
echo "4. git push"

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Helper to safely rename folders
const safeRename = (oldPath, newPath) => {
    if (fs.existsSync(oldPath)) {
        try {
            fs.renameSync(oldPath, newPath);
            return true;
        } catch (e) {
            console.error(`Error renaming ${oldPath} to ${newPath}:`, e);
            return false;
        }
    }
    return false;
};

// Paths relative to project root (where package.json is)
const API_PATH = 'app/api';
const API_HIDDEN = 'app/_api';
const ADMIN_PATH = 'app/admin';
const ADMIN_HIDDEN = 'app/_admin';
const MIDDLEWARE = 'middleware.ts';
const MIDDLEWARE_HIDDEN = '_middleware.ts';

console.log('📦 Starting static build package...');
console.log('   (Temporarily hiding dynamic routes)...');

// 1. Hide Dynamic Routes
const movedApi = safeRename(API_PATH, API_HIDDEN);
const movedAdmin = safeRename(ADMIN_PATH, ADMIN_HIDDEN);
const movedMiddleware = safeRename(MIDDLEWARE, MIDDLEWARE_HIDDEN);

try {
    // 2. Run Next.js Build
    console.log('🚀 Running next build...');
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ Build successful!');
} catch (error) {
    console.error('❌ Build failed!');
    process.exit(1);
} finally {
    // 3. Restore Files (Always run this to prevent broken project)
    console.log('🔄 Restoring files...');
    if (movedApi) safeRename(API_HIDDEN, API_PATH);
    if (movedAdmin) safeRename(ADMIN_HIDDEN, ADMIN_PATH);
    if (movedMiddleware) safeRename(MIDDLEWARE_HIDDEN, MIDDLEWARE);
    console.log('✨ All done! Ready to upload "out" folder.');
}

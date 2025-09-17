const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'blogs');
const scriptsDir = path.join(__dirname, 'scripts'); // New path for scripts
const indexFilePath = path.join(blogsDir, 'index.json');

function extractMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/; // Regex to match front matter
    const match = content.match(frontMatterRegex);

    let title = '';
    let description = '';

    if (match) {
        const frontMatter = match[1];
        const lines = frontMatter.split('\n');
        lines.forEach(line => {
            const [key, ...value] = line.split(':');
            if (key.trim() === 'title') {
                title = value.join(':').trim();
            } else if (key.trim() === 'description') {
                description = value.join(':').trim();
            }
        });
    } else {
        // Fallback for Fountain files: extract title from the first line
        const firstLine = content.split('\n')[0];
        if (firstLine.startsWith('Title:')) {
            title = firstLine.replace('Title:', '').trim();
        }
    }

    return { title, description };
}

function generateIndex() {
    fs.readdir(blogsDir, (err, blogFiles) => {
        if (err) {
            console.error('Error reading blogs directory:', err);
            return;
        }

        const markdownFiles = blogFiles.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
        const posts = markdownFiles.map(file => {
            const filePath = path.join(blogsDir, file);
            const { title, description } = extractMetadata(filePath);
            return { file, title, description };
        });

        // Now handle the scripts directory
        fs.readdir(scriptsDir, (err, scriptFiles) => {
            if (err) {
                console.error('Error reading scripts directory:', err);
                return;
            }

            const fountainFiles = scriptFiles.filter(file => file.endsWith('.fountain'));
            const scriptPosts = fountainFiles.map(file => {
                const filePath = path.join(scriptsDir, file);
                const { title } = extractMetadata(filePath); // Description can be left empty
                return { file, title, description: '' }; // No description for Fountain files
            });

            const index = { posts: [...posts, ...scriptPosts] };

            fs.writeFile(indexFilePath, JSON.stringify(index, null, 2), (err) => {
                if (err) {
                    console.error('Error writing index.json:', err);
                } else {
                    console.log('index.json generated successfully.');
                }
            });
        });
    });
}

generateIndex();

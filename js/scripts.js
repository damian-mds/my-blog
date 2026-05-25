let blogPosts = [];

fetch('js/data.json')
    .then(res => res.json())
    .then(data => {
        blogPosts = data;
        generateBlogPosts();
    });

function formatDate(dateString) {
    const [day, month, year] = dateString.split('-');
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
}

function generateBlogPosts() {
    const postsContainer = document.querySelector('.blog-posts');
    
    [...blogPosts].reverse().forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        
        const tagElements = post.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        postElement.innerHTML = `
            <header class="post-header">
                <h2 class="post-title">${post.title}</h2>
                <time class="post-date" datetime="${post.date}">${formatDate(post.date)}</time>
            </header>
            <div class="post-content">
                <p><b>What went well :D</b></p>
                <p>${post.wentWell}</p><br>
                <p><b>What didn't go well D:</b></p>
                <p>${post.notWell}</p><br>
                <p><b>What can be improved :exhale:</b></p>
                <p>${post.canImprove}</p><br>
                <p><b>Next Actions</b></p>
                <p>${post.nextSprint}</p>
            </div>
            <div class="post-tags">
                ${tagElements}
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}
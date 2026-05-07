const blogPosts = [
    {
        id: 1,
        title: "Week 01",
        date: "08-05-2026",
        wentWell: "The aspects of the project which went well this week has the been the development of the problem statement after some informal interviews with my friends, as they helped me figure what to base the project on.",
        notWell: "Deciding what topic to focus on was an element that didn't go particularly well as I struggle to figure out a problem that I was experiencing that didn't already have a solution.",
        canImprove: "Something that I had learnt was that if you are unsure of something the best thing to do is to ask someone else, since two heads are better than one. Asking my friends about whether or not they have potential problems in their day to day lives that they didn't have an immediate solution for helped me decide the topic for this brief", 
        nextSprint: "Going forward I will definitely be making use of the resources around me, particularly my peers as that has been helpful for me in what is arguably the most critical stage of the project.",
        tags: ["Research", "Development", "Ideating"]
    }
];

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
    
    blogPosts.forEach(post => {
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

document.addEventListener('DOMContentLoaded', () => {
    generateBlogPosts();
});
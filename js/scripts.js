/*  scripts.js  —  Supabase version (dev branch)

    TODO: Replace these two values with your own Supabase project credentials.
    Found in your project at:  https://app.supabase.com/project/<ID>/settings/api
*/
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';

// Create the Supabase client (global variable so index.html's script tag finds it)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

async function loadPosts() {
    // Fetch sprints
    const { data: sprints, error: sprintsError } = await supabase
        .from('sprints')
        .select('*')
        .order('id', { ascending: false });

    if (sprintsError) {
        console.error('Error fetching sprints:', sprintsError);
        document.querySelector('.blog-posts').innerHTML =
            '<p class="error">Failed to load blog posts. Check the console.</p>';
        return;
    }

    // Fetch all tags
    const { data: allTags, error: tagsError } = await supabase
        .from('sprint_tags')
        .select('*');

    if (tagsError) {
        console.error('Error fetching tags:', tagsError);
        document.querySelector('.blog-posts').innerHTML =
            '<p class="error">Failed to load blog tags. Check the console.</p>';
        return;
    }

    // Merge tags into each sprint (same shape as the old data.json)
    const posts = sprints.map(sprint => ({
        ...sprint,
        tags: allTags
            .filter(t => t.sprint_id === sprint.id)
            .map(t => t.tag)
    }));

    generateBlogPosts(posts);
}

function formatDate(dateString) {
    const [day, month, year] = dateString.split('-');
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
}

function generateBlogPosts(posts) {
    const postsContainer = document.querySelector('.blog-posts');
    
    posts.forEach(post => {
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

// Start
loadPosts();

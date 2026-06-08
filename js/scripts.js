/*  scripts.js  —  Supabase version (dev branch)
    Full CRUD: Create, Read, Update, Delete blog posts.

    TODO: Replace these two values with your own Supabase project credentials.
    Found in your project at:  https://app.supabase.com/project/<ID>/settings/api
*/
const SUPABASE_URL  = 'https://tsrfpkccxkysbzdgbero.supabase.co';
const SUPABASE_ANON = 'sb_publishable_Pkirb2u25qSiPv-OE5u0fw_m9gQBcq-';

// Create the Supabase client
const supabase = window.__supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Toast notification ─────────────────────────────────────────────────

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// ── Load & render posts (Read) ─────────────────────────────────────────

async function loadPosts() {
    const postsContainer = document.querySelector('.blog-posts');
    postsContainer.innerHTML = '';  // clear current

    // Fetch sprints
    const { data: sprints, error: sprintsError } = await supabase
        .from('sprints')
        .select('*')
        .order('id', { ascending: false });

    if (sprintsError) {
        console.error('Error fetching sprints:', sprintsError);
        postsContainer.innerHTML =
            '<p class="error">Failed to load blog posts. Check the console.</p>';
        return;
    }

    // Fetch all tags
    const { data: allTags, error: tagsError } = await supabase
        .from('sprint_tags')
        .select('*');

    if (tagsError) {
        console.error('Error fetching tags:', tagsError);
        return;  // still render posts, just without tags
    }

    // Merge tags into each sprint
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

    if (posts.length === 0) {
        postsContainer.innerHTML =
            '<p style="text-align:center;color:#666;">No posts yet. Click "+ New Post" above.</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post';

        // Action buttons (edit / delete)
        const actionsHtml = `
            <div class="post-actions">
                <button onclick="showEditForm(${post.id})" title="Edit this post">Edit</button>
                <button class="delete-btn" onclick="deletePost(${post.id})" title="Delete this post">Delete</button>
            </div>`;

        const tagElements = post.tags.map(tag =>
            `<span class="tag">${tag}</span>`
        ).join('');

        postElement.innerHTML = `
            ${actionsHtml}
            <header class="post-header">
                <h2 class="post-title">${escapeHtml(post.title)}</h2>
                <time class="post-date" datetime="${post.date}">${formatDate(post.date)}</time>
            </header>
            <div class="post-content">
                <p><b>What went well :D</b></p>
                <p>${escapeHtml(post.went_well)}</p><br>
                <p><b>What didn't go well D:</b></p>
                <p>${escapeHtml(post.not_well)}</p><br>
                <p><b>What can be improved :exhale:</b></p>
                <p>${escapeHtml(post.can_improve)}</p><br>
                <p><b>Next Actions</b></p>
                <p>${escapeHtml(post.next_sprint)}</p>
            </div>
            <div class="post-tags">
                ${tagElements}
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Basic HTML escaping to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ── Modal helpers ──────────────────────────────────────────────────────

function openModal() {
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    clearForm();
}

function clearForm() {
    document.getElementById('edit-id').value = '';
    document.getElementById('form-title').value = '';
    document.getElementById('form-date').value = '';
    document.getElementById('form-went').value = '';
    document.getElementById('form-not').value = '';
    document.getElementById('form-improve').value = '';
    document.getElementById('form-next').value = '';
    document.getElementById('form-tags').value = '';
    document.getElementById('modal-title').textContent = 'New Post';
    document.getElementById('save-btn').textContent = 'Save Post';
}

// ── Create (C) ─────────────────────────────────────────────────────────

function showCreateForm() {
    clearForm();
    document.getElementById('modal-title').textContent = 'New Post';
    document.getElementById('save-btn').textContent = 'Save Post';
    openModal();
    document.getElementById('form-title').focus();
}

// ── Edit (U) ───────────────────────────────────────────────────────────

async function showEditForm(sprintId) {
    // Fetch the sprint
    const { data: sprint, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('id', sprintId)
        .single();

    if (error || !sprint) {
        showToast('Could not load post. It may have been deleted.', true);
        return;
    }

    // Fetch its tags
    const { data: tags } = await supabase
        .from('sprint_tags')
        .select('tag')
        .eq('sprint_id', sprintId);

    clearForm();
    document.getElementById('edit-id').value = sprint.id;
    document.getElementById('form-title').value = sprint.title;
    document.getElementById('form-date').value = sprint.date;
    document.getElementById('form-went').value = sprint.went_well;
    document.getElementById('form-not').value = sprint.not_well;
    document.getElementById('form-improve').value = sprint.can_improve;
    document.getElementById('form-next').value = sprint.next_sprint;

    // Comma-separated tags
    if (tags && tags.length > 0) {
        document.getElementById('form-tags').value = tags.map(t => t.tag).join(', ');
    }

    document.getElementById('modal-title').textContent = 'Edit Post';
    document.getElementById('save-btn').textContent = 'Update Post';
    openModal();
}

// ── Save (Create or Update) ────────────────────────────────────────────

async function savePost(sprintId, title, date, wentWell, notWell, canImprove, nextSprint, tags) {
    // Insert or update the sprint row
    const sprintData = { title, date, went_well: wentWell, not_well: notWell, can_improve: canImprove, next_sprint: nextSprint };

    let sprintResult;
    if (sprintId) {
        // Update existing
        const { error: updateError } = await supabase
            .from('sprints')
            .update(sprintData)
            .eq('id', sprintId);
        if (updateError) {
            console.error('Update error:', updateError);
            showToast('Failed to update post: ' + updateError.message, true);
            return;
        }
        sprintResult = { id: sprintId };
    } else {
        // Insert new
        const { data: inserted, error: insertError } = await supabase
            .from('sprints')
            .insert(sprintData)
            .select()
            .single();
        if (insertError) {
            console.error('Insert error:', insertError);
            showToast('Failed to create post: ' + insertError.message, true);
            return;
        }
        sprintResult = inserted;
    }

    const finalSprintId = sprintResult.id;

    // Handle tags: delete old tags for this sprint, insert new ones
    const parsedTags = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

    // Delete existing tags for this sprint
    await supabase.from('sprint_tags').delete().eq('sprint_id', finalSprintId);

    // Insert new tags
    if (parsedTags.length > 0) {
        const tagRecords = parsedTags.map(tag => ({ sprint_id: finalSprintId, tag }));
        await supabase.from('sprint_tags').insert(tagRecords);
    }

    closeModal();
    showToast(sprintId ? 'Post updated!' : 'Post created!');
    loadPosts();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const sprintId = document.getElementById('edit-id').value;
    const title = document.getElementById('form-title').value.trim();
    const date = document.getElementById('form-date').value.trim();
    const wentWell = document.getElementById('form-went').value.trim();
    const notWell = document.getElementById('form-not').value.trim();
    const canImprove = document.getElementById('form-improve').value.trim();
    const nextSprint = document.getElementById('form-next').value.trim();
    const tags = document.getElementById('form-tags').value.trim();

    if (!title || !date || !wentWell || !notWell || !canImprove || !nextSprint || !tags) {
        showToast('Please fill in all fields.', true);
        return;
    }

    savePost(sprintId || null, title, date, wentWell, notWell, canImprove, nextSprint, tags);
}

// ── Delete (D) ─────────────────────────────────────────────────────────

async function deletePost(sprintId) {
    if (!confirm('Delete this post? This cannot be undone.')) return;

    const { error } = await supabase
        .from('sprints')
        .delete()
        .eq('id', sprintId);

    if (error) {
        console.error('Delete error:', error);
        showToast('Failed to delete post: ' + error.message, true);
        return;
    }

    showToast('Post deleted.');
    loadPosts();
}

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

// Expose CRUD functions globally for inline HTML onclick handlers
window.showCreateForm = showCreateForm;
window.showEditForm = showEditForm;
window.deletePost = deletePost;
window.handleFormSubmit = handleFormSubmit;
window.closeModal = closeModal;

// ── Start ──────────────────────────────────────────────────────────────
loadPosts();

let videosData = [];
const videosContainer = document.getElementById('videocontainer');
const categoriesContainer = document.getElementById('btncontainer');

fetch('https://openapi.programming-hero.com/api/videos/categories')
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            displayCategories(data.data);
        } else {
            console.error('Error fetching categories:', data.message);
        }
    })
    .catch(error => console.error('Error fetching categories:', error));

function displayCategories(categories) {
    categories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.textContent = category.category;
        categoryButton.classList.add('btn', 'btn-secondary');
        categoryButton.addEventListener('click', () => {
            fetchAndDisplayVideos(category.category_id);
            setActiveCategory(categoryButton);
        });
        categoriesContainer.appendChild(categoryButton);
    });

    
    fetchAndDisplayVideos(categories[0].category_id);
}

function setActiveCategory(activeButton) {
    const categoryButtons = categoriesContainer.getElementsByTagName('button');
    Array.from(categoryButtons).forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

function fetchAndDisplayVideos(categoryId) {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                videosData = data.data;
                displayVideos(data.data);
            } else {
                videosContainer.innerHTML = `
                    <img id="error" class="img-fluid" src="assets/images/sorry_no_videos_tiny.png" alt="" />
                `;
            }
        })
        .catch(error => {
            videosContainer.innerHTML = `
                <img id="error" class="img-fluid" src="assets/images/sorry_no_videos_tiny.png" alt="" />
            `;
        });
}

function sortAndDisplayVideosByViews() {
    if (videosData.length > 0) {
        const sortedVideos = sortVideosByViews(videosData);
        displayVideos(sortedVideos);
    } else {
        console.error('No videos available to sort.');
    }
}

function sortVideosByViews(videos) {
    return videos.slice().sort((a, b) => {
        const viewsA = parseInt(a.others.views.replace(/[^\d]/g, ''), 10) || 0;
        const viewsB = parseInt(b.others.views.replace(/[^\d]/g, ''), 10) || 0;
        return viewsB - viewsA;
    });
}

function displayVideos(videos) {
    videosContainer.innerHTML = '';

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('col-md-3');

        const postedDate = video.others.posted_date ? video.others.posted_date : null;

        const daysAgo = Math.floor(postedDate / (60 * 60 * 24));
        const hoursAgo = Math.floor((postedDate % (60 * 60 * 24)) / (60 * 60));
        const minutesAgo = Math.floor((postedDate % (60 * 60)) / (60));

        videoElement.innerHTML = `
            <div class="imgdiv h-auto position-relative">
                <img id="thumbnail" class="img-fluid" src="${video.thumbnail}" alt="" />
                ${video.others.posted_date ? `<p id="uploadtime">${daysAgo > 0 ? `${daysAgo} ${daysAgo === 1 ? 'd' : 'ds'}` : ''} ${daysAgo > 0 && hoursAgo > 0 ? '' : ''} ${hoursAgo > 0 ? `${hoursAgo} ${hoursAgo === 1 ? 'h' : 'hs'}` : ''} ${daysAgo === 0 && hoursAgo === 0 ? `${minutesAgo} ${minutesAgo === 1 ? 'm' : 'ms'}` : ''} ago</p>` : ''}
            </div>
            <div class="row gap-1" id="detaildv">
                <div class="col-md-2">
                    <img id="author-img" src="${video.authors[0].profile_picture}" alt="" />
                </div>
                <div class="col-md-9">
                    <a class="nav-link" href="#"><h2 class="title">${video.title}</h2></a>
                    <div class="row authorname">
                        <h6>
                            ${video.authors[0].profile_name}
                            <span>
                                ${video.authors[0].verified ? '<img src="assets/images/verifiedIcon.svg" alt="" />' : ''}
                            </span>
                        </h6>
                        ${video.others.views ? `<p id="video-views">${video.others.views} views</p>` : ''}
                    </div>
                </div>
            </div>
        `;
        videosContainer.appendChild(videoElement);
    });
}

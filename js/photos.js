const REPO_OWNER = "mvhscryptoden";
const REPO_NAME = "mvhscryptoden.github.io";
const PHOTOS_PATH = "media/clubphotos";

const photosSection = document.getElementById("photosSection");

async function loadPhotos() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PHOTOS_PATH}`
        );

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const files = await response.json();

        const imageFiles = files.filter(file =>
            file.type === "file" &&
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
        );

        if (imageFiles.length === 0) {
            photosSection.innerHTML = `
                <p class="no-photos">No photos have been uploaded yet.</p>
            `;
            return;
        }

        const gallery = document.createElement("div");
        gallery.className = "photo-grid";

        imageFiles.forEach(file => {
            const photo = document.createElement("img");

            photo.src = file.download_url;
            photo.alt = file.name;
            photo.loading = "lazy";

            gallery.appendChild(photo);
        });

        photosSection.innerHTML = "";
        photosSection.appendChild(gallery);

    } catch (error) {
        console.error("Failed to load photos:", error);

        photosSection.innerHTML = `
            <p class="photo-error">
                We couldn't load the photos right now.
            </p>
        `;
    }
}

loadPhotos();
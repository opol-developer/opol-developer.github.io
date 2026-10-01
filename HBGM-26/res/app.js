document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const playBtnText = document.getElementById('playBtnText');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const record = document.getElementById('record');
    const tonearm = document.getElementById('tonearm');
    const platterArea = document.getElementById('platterArea');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const recordLabel = document.getElementById('recordLabel');
    const letterContent = document.getElementById('letterContent');

    let playlist = [];
    let currentIndex = 0;
    let isPlaying = false;

    // Danh sách nhạc dự phòng nếu m.json chưa ready
    const fallbackPlaylist = [
        {
            title: "Happy Birthday Grandma",
            artist: "Vintage Music Box",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: ""
        }
    ];

    // 1. Load nhạc từ res/m.json
    fetch('res/m.json')
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải m.json");
            return response.json();
        })
        .then(data => {
            playlist = Array.isArray(data) && data.length > 0 ? data : fallbackPlaylist;
            loadSong(0);
        })
        .catch(err => {
            console.warn("Dùng danh sách nhạc dự phòng:", err);
            playlist = fallbackPlaylist;
            loadSong(0);
        });

    // 2. Load lá thư từ res/c.html
    fetch('res/c.html')
        .then(response => {
            if (!response.ok) throw new Error("Không tìm thấy tệp c.html");
            return response.text();
        })
        .then(html => {
            letterContent.innerHTML = html;
        })
        .catch(err => {
            letterContent.innerHTML = `
                <p><u>Kính gửi Bà Ngoại yêu thương,</u></p>
                <p><u>Nhân ngày sinh nhật của Bà, cháu kính chúc Bà luôn luôn mạnh khỏe, bình an và tràn đầy niềm vui bên gia đình.</u></p>
                <p><u>Cháu yêu Bà rất nhiều!</u></p>
            `;
        });

    // Hàm hiển thị bài hát
    function loadSong(index) {
        currentIndex = index;
        const song = playlist[currentIndex];
        songTitle.textContent = song.title || "Chưa đặt tên";
        songArtist.textContent = song.artist || "Nhiều nghệ sĩ";
        audio.src = song.src;

        if (song.cover) {
            recordLabel.style.backgroundImage = `url('${song.cover}')`;
            recordLabel.innerHTML = '';
        } else {
            recordLabel.style.backgroundImage = 'none';
            recordLabel.innerHTML = '<span class="material-symbols-outlined music-note-icon">music_note</span>';
        }

        if (isPlaying) {
            audio.play().catch(() => {});
        }
    }

    // Toggle Play/Pause
    function togglePlay() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function playSong() {
        isPlaying = true;
        audio.play().then(() => {
            record.classList.add('spinning');
            tonearm.classList.add('playing');
            playIcon.textContent = 'pause';
            playBtnText.textContent = '';
        }).catch(err => {
            console.log("Cần tương tác người dùng để phát âm thanh", err);
        });
    }

    function pauseSong() {
        isPlaying = false;
        audio.pause();
        record.classList.remove('spinning');
        tonearm.classList.remove('playing');
        playIcon.textContent = 'play_arrow';
        playBtnText.textContent = '';
    }

    // Event Listeners
    playBtn.addEventListener('click', togglePlay);
    platterArea.addEventListener('click', togglePlay);

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
        if (isPlaying) playSong();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        if (isPlaying) playSong();
    });

    audio.addEventListener('ended', () => {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        playSong();
    });
});

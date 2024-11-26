import * as THREE from './module/three.module.js'; // Mengimpor modul Three.js

main(); // Memanggil fungsi utama

function main() {
    // --------------------
    // PART 1: INISIALISASI
    // --------------------

    // Buat konteks
    const canvas = document.querySelector("#c"); // Mengambil elemen canvas
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true // Mengaktifkan antialiasing untuk tampilan lebih halus
    });

    // Buat kamera
    const angleOfView = 55; // Sudut pandang kamera
    const aspectRatio = canvas.clientWidth / canvas.clientHeight; // Rasio aspek
    const nearPlane = 0.1; // Bidang dekat
    const farPlane = 100; // Bidang jauh
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 5, 25); // Posisi kamera

    // Buat scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.9, 0.85, 0.6);// Mengubah warna latar belakang
    const fog = new THREE.Fog("lightwhite", 1, 100); // Mengatur kabut
    scene.fog = fog; // Menambahkan kabut ke scene

    // --------------------
    // PART 2: GEOMETRI DAN MATERIAL
    // --------------------

    // GEOMETRY
    // Buat kubus
    const cubeSize = 4; // Ukuran kubus
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Buat bola
    const sphereRadius = 2; // Jari-jari bola
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 16);

    // Buat bidang
    const planeWidth = 256; // Lebar bidang
    const planeHeight = 256; // Tinggi bidang
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    // MATERIALS
    const textureLoader = new THREE.TextureLoader(); // Memuat tekstur

    // Material kubus dengan tekstur
    const cubeTextureMap = textureLoader.load('image/yaho.png'); // Ganti dengan jalur ke tekstur kubus
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: cubeTextureMap // Menambahkan tekstur ke kubus
    });

    // Material bola dengan normal map
    const sphereNormalMap = textureLoader.load('image/yuhu.png'); // Memuat normal map
    sphereNormalMap.wrapS = THREE.RepeatWrapping; // Mengatur pembungkusan
    sphereNormalMap.wrapT = THREE.RepeatWrapping; // Mengatur pembungkusan
    const sphereMaterial = new THREE.MeshStandardMaterial({
     // Mengubah warna bola
        normalMap: sphereNormalMap // Menambahkan normal map
    });

    // Material bidang dengan tekstur dan normal map
    const planeTextureMap = textureLoader.load('image/motif.png'); // Memuat tekstur bidang
    planeTextureMap.wrapS = THREE.RepeatWrapping; // Mengatur pembungkusan
    planeTextureMap.wrapT = THREE.RepeatWrapping; // Mengatur pembungkusan
    planeTextureMap.repeat.set(16, 16); // Mengatur pengulangan
    const planeNorm = textureLoader.load('image/motif.png'); // Memuat normal map untuk bidang
    planeNorm.wrapS = THREE.RepeatWrapping; // Mengatur pembungkusan
    planeNorm.wrapT = THREE.RepeatWrapping; // Mengatur pembungkusan
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap, // Menambahkan tekstur
        side: THREE.DoubleSide, // Mengatur kedua sisi
        normalMap: planeNorm // Menambahkan normal map
    });

    // MESHES
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial); // Menggabungkan geometris dan material
    cube.position.set(2, 5, 0); // Posisi kubus
    scene.add(cube); // Menambahkan kubus ke scene

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); // Menggabungkan geometris dan material untuk bola
    sphere.position.set(-sphereRadius - 2, 5, 0); // Posisi bola
    scene.add(sphere); // Menambahkan bola ke scene

    const plane = new THREE.Mesh(planeGeometry, planeMaterial); // Menggabungkan geometris dan material untuk bidang
    plane.rotation.x = -Math.PI / 2; // Memutar bidang 90 derajat
    scene.add(plane); // Menambahkan bidang ke scene

    // --------------------
    // PART 3: ANIMASI DAN RENDER
    // --------------------

    // LIGHTS
    const color = 0xededc5; // Warna cahaya
    const intensity = 1; // Mengubah intensitas cahaya
    const light = new THREE.DirectionalLight(color, intensity); // Membuat cahaya arah
    light.position.set(5, 30, 30); // Mengubah posisi cahaya
    scene.add(light); // Menambahkan cahaya ke scene

    const ambientColor = 0xb3b396; // Warna cahaya ambient
    const ambientIntensity = 0.3; // Mengubah intensitas cahaya ambient
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity); // Membuat cahaya ambient
    scene.add(ambientLight); // Menambahkan cahaya ambient ke scene

   // --------------------
    // PART 4: PARTIKEL
    // --------------------

    // Geometri untuk partikel
    const particleCount = 1000; // Jumlah partikel
    const particleGeometry = new THREE.BufferGeometry(); // Buat geometri partikel
    const particlePositions = new Float32Array(particleCount * 3); // Array untuk menyimpan posisi partikel
    const particleSpeeds = new Float32Array(particleCount); // Array untuk menyimpan kecepatan jatuh partikel

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() * 40) - 20; // Posisi acak di sumbu X
        const y = Math.random() * 40 + 10; // Posisi acak di sumbu Y (mulai lebih tinggi)
        const z = (Math.random() * 40) - 20; // Posisi acak di sumbu Z
        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;
        
        // Kecepatan acak untuk setiap partikel
        particleSpeeds[i] = Math.random() * 0.1 + 0.01; // Kecepatan jatuh acak
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3)); // Atur posisi partikel

    // Material untuk partikel
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF, // Warna partikel
        size: 0.5, // Ukuran partikel
        transparent: true, // Agar transparan
        opacity: 0.8 // Tingkat transparansi
    });

    // Membuat objek partikel
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles); // Tambahkan partikel ke scene

    // Update Partikel dalam fungsi draw
    function draw(time) {
        time *= 0.001; // Mengubah waktu menjadi detik

        if (resizeGLToDisplaySize(gl)) { // Memeriksa apakah ukuran harus diubah
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight; // Memperbarui rasio aspek
            camera.updateProjectionMatrix(); // Memperbarui matriks proyeksi
        }

        // Rotasi kubus
        cube.rotation.x += 0.00; // Mengubah kecepatan rotasi kubus
        cube.rotation.y += 0.02; // Mengubah kecepatan rotasi kubus

        // Rotasi bola
        sphere.rotation.x += 0.02; // Mengubah kecepatan rotasi bola
        sphere.rotation.y += 0.02; // Mengubah kecepatan rotasi bola

        // Update posisi partikel agar jatuh dari atas ke bawah
        const positions = particleGeometry.attributes.position.array; // Ambil array posisi partikel
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] -= particleSpeeds[i]; // Update posisi Y partikel berdasarkan kecepatan
            
            // Jika partikel jatuh terlalu jauh ke bawah, reset ke atas
            if (positions[i * 3 + 1] < -20) {
                positions[i * 3 + 1] = 20 + Math.random() * 10; // Reset posisi Y partikel ke atas
            }
        }
        particleGeometry.attributes.position.needsUpdate = true; // Tandai posisi sebagai diperbarui

        // Animasi partikel (contoh: rotasi partikel)
        particles.rotation.y += 0.002; // Gerakan rotasi pada partikel

        // Menggerakkan cahaya
        light.position.x = 20 * Math.cos(time); 
        light.position.y = 20 * Math.sin(time); 
        gl.render(scene, camera); // Menggambar scene
        requestAnimationFrame(draw); // Meminta frame berikutnya
    }

    requestAnimationFrame(draw); //Â MemulaiÂ animasi
    

    // UPDATE RESIZE
    function resizeGLToDisplaySize(gl) {
        const canvas = gl.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height; // Memeriksa apakah perlu mengubah ukuran
        if (needResize) {
            gl.setSize(width, height, false); // Mengatur ukuran canvas
        }
        return needResize; // Mengembalikan status perubahan ukuran
    }
}

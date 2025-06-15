document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const extractBtn = document.getElementById('extractBtn');
    const videoPlayer = document.getElementById('videoPlayer');
    const streamUrlDisplay = document.getElementById('streamUrl');

    // Check if HLS is supported
    if (Hls.isSupported()) {
        const hls = new Hls();
        
        extractBtn.addEventListener('click', async () => {
            const url = urlInput.value.trim();
            if (!url) {
                alert('Please enter a valid URL');
                return;
            }

            try {
                extractBtn.disabled = true;
                extractBtn.textContent = 'Extracting...';
                
                // Call the GitHub Actions workflow
                const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/m3u8_StreamSniper/actions/workflows/scrape-live-stream.yml/dispatches', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': 'token YOUR_GITHUB_TOKEN',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ref: 'main',
                        inputs: {
                            url: url
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to trigger workflow');
                }

                // Wait for the workflow to complete and get the stream URL
                // Note: In a real implementation, you'd need to poll the workflow status
                // and fetch the results. This is a simplified version.
                
                // For demo purposes, we'll simulate finding a stream URL
                const streamUrl = await simulateStreamExtraction(url);
                
                if (streamUrl) {
                    streamUrlDisplay.textContent = streamUrl;
                    hls.loadSource(streamUrl);
                    hls.attachMedia(videoPlayer);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        videoPlayer.play();
                    });
                } else {
                    alert('No stream URL found');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to extract stream URL');
            } finally {
                extractBtn.disabled = false;
                extractBtn.textContent = 'Extract Stream';
            }
        });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari, which has native HLS support
        videoPlayer.addEventListener('loadedmetadata', () => {
            videoPlayer.play();
        });
    } else {
        alert('HLS is not supported in your browser');
    }
});

// Simulated function to extract stream URL
// In a real implementation, this would be replaced with actual API calls
async function simulateStreamExtraction(url) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, return a sample stream URL
    // In reality, this would come from the GitHub Actions workflow
    return 'https://example.com/stream.m3u8';
} 
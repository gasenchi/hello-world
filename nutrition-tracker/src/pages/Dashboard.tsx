import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material'

export default function Dashboard() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
  }, [stream])

  const startCamera = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      setStream(media)
      if (videoRef.current) {
        videoRef.current.srcObject = media
        await videoRef.current.play()
      }
    } catch (err) {
      console.error('Unable to access camera', err)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, width, height)
    const dataUrl = canvas.toDataURL('image/jpeg')
    setCapturedImage(dataUrl)
  }, [])

  const onUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setUploadedImage(String(ev.target?.result))
    reader.readAsDataURL(file)
  }, [])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>Scan or Upload</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>Live Camera</Typography>
              <Box sx={{ mt: 1, position: 'relative', aspectRatio: '3 / 4', bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden' }}>
                <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </Box>
            </CardContent>
            <CardActions>
              {!stream ? (
                <Button variant="contained" onClick={startCamera}>Start Camera</Button>
              ) : (
                <>
                  <Button variant="contained" onClick={capturePhoto}>Capture</Button>
                  <Button color="inherit" onClick={stopCamera}>Stop</Button>
                </>
              )}
            </CardActions>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>Your Image</Typography>
              <Box sx={{ mt: 1, aspectRatio: '3 / 4', bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {capturedImage ? (
                  <CardMedia component="img" image={capturedImage} alt="Captured" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : uploadedImage ? (
                  <CardMedia component="img" image={uploadedImage} alt="Uploaded" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Typography color="text.secondary">No image yet</Typography>
                )}
              </Box>
            </CardContent>
            <CardActions>
              <Button variant="outlined" component="label">
                Upload Photo
                <input type="file" accept="image/*" hidden onChange={onUpload} />
              </Button>
              <Button variant="contained" disabled={!capturedImage && !uploadedImage}>Analyze (Mock)</Button>
            </CardActions>
          </Card>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600}>Recent Activity</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Recent scans and uploads will show here after analysis is integrated.</Typography>
        </CardContent>
      </Card>
    </Stack>
  )
}


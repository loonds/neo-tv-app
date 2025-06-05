export function resolveAssetPath(path) {
  const userAgent = navigator.userAgent || ''
  const isAndroid = /Android/i.test(userAgent)
  const isFileProtocol = window.location.protocol === 'file:'

  if (isAndroid && isFileProtocol) {
    // Running inside Android WebView (APK or emulator)
    return `file:///android_asset/${path}`
  }

  // Normal web browser (localhost, http://, etc.)
  return path
}

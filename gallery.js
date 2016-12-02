class Gallery {
  constructor(images) {
    this.images = images
    this.galleryContainer = document.createElement("div")
    this.galleryContainer.className = "gallery inactive"
    document.body.appendChild(this.galleryContainer)

    this.images.forEach((image, index) => {
      image.onclick = this.openGallery.bind(this, image, index)
    })

    this.imageContainer = null
    this.currentImage = null
    this.animating = false
    this.windowListener = e => this.handleWinKeyDown(e)
  }

  openGallery(image, index) {
    window.addEventListener("keydown", this.windowListener)
    this.currentImageIndex = index

    this.galleryContainer.classList.remove("inactive")

    this.imageContainer = document.createElement("div")
    this.imageContainer.className = "gallery-image-bounding-box"
    this.imageContainer.style.position = "relative"
    this.imageContainer.style.top = image.offsetTop
    this.imageContainer.style.left = image.offsetLeft
    this.imageContainer.style.width = image.width
    this.imageContainer.style.height = image.height

    this.currentImage = document.createElement("img")
    this.currentImage.src = image.src

    this.imageContainer.appendChild(this.currentImage)
    this.galleryContainer.appendChild(this.imageContainer)

    setTimeout(() => {
      this.animating = true
      this.imageContainer.style.top = 0
      this.imageContainer.style.left = 0
      this.imageContainer.style.width = "100%"
      this.imageContainer.style.height = "100%"
    }, 0)

    this.imageContainer.addEventListener(
      "transitionend",
      () => { this.animating = false },
      { once: true }
    )
  }

  closeGallery() {
    let originalImage = this.images[this.currentImageIndex]
    this.imageContainer.addEventListener(
      "transitionend",
      () => {
        this.animating = false
        this.imageContainer = null
        this.currentImage = null
        this.galleryContainer.innerHTML = "";
        window.removeEventListener("keydown", this.windowListener)
      },
      { once: true }
    )

    this.animating = true
    this.imageContainer.style.top = originalImage.offsetTop
    this.imageContainer.style.left = originalImage.offsetLeft
    this.imageContainer.style.width = originalImage.width
    this.imageContainer.style.height = originalImage.height

    this.galleryContainer.classList.add("inactive")
  }

  cycleImage(delta) {
    if (this.animating) return
    this.currentImageIndex += this.images.length + delta
    this.currentImageIndex %= this.images.length
    this.currentImage.src = this.images[this.currentImageIndex].src
  }

  handleWinKeyDown(e) {
    switch (e.key) {
      case "Escape":
        this.closeGallery()
        return
      case "ArrowLeft":
      case "h":
      case "ArrowUp":
      case "k":
        this.cycleImage(-1)
        return
      case "ArrowRight":
      case "l":
      case "ArrowDown":
      case "j":
        this.cycleImage(1)
        return
      default: return
    }
  }
}

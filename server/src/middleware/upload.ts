import multer, { diskStorage, Options } from 'multer'
import { v4 } from 'uuid'

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()
    cb(null, `${v4()}.${ext}`)
  }
})

const options: Options = {
  fileFilter: (req, file, cb) => {
    if(file.mimetype.includes('image')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },

  limits: {
    fileSize: 1024 ** 2 * 2
  }
}

const upload = multer({
  storage,
  ...options
})

export default upload
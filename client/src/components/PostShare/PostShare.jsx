import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {
  FaPhotoVideo,
  FaLocationArrow,
  FaRegCalendarAlt
} from 'react-icons/fa'
import { useDispatch, useSelector } from "react-redux"
import { uploadImage, uploadPost } from "../../redux/actions/UploadAction"

const Container = styled.div`
  height: 120px;
  width: 600px;
  background: silver;
  border-radius: 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`
const ProfilePic = styled.img`
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 10px;
`
const Input = styled.input`
  width: 550px;
  height: 30px;
  border-radius: 10px;
  border: none;
  outline:none;
  padding-left: 15px;
`
const ShareContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
`
const Option = styled.a`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
`
const Span = styled.span`
  font-size: 15px;
  margin-left: 15px;
`
const Button = styled.button`
  height: 25px;
  width: 60px;
  font-size: 15px;
  border: none;
  border-radius: 10px;
  background: orangered;
  color: white;
  margin-bottom: 5px;
  cursor: pointer;
`
export const PreviewContainer = styled.div`
position: sticky;
margin-top: 22px;
`
export const PreviewImage = styled.div`
`
export const Img = styled.img`
  height: 350px;
  width: 600px;
  max-height: 20rem;
  object-fit: cover;
  border-radius: 0.5rem;
`
export default function PostShare() {

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.authReducer.authData)
  const loading = useSelector((state) => state.postReducer.uploading)
  const [image, setImage] = useState(null)
  const desc = useRef()
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0]
      setImage(img)
    }
  }

  const imageRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    }

    if (image) {
      const data = new FormData()
      const fileName = Date.now() + image.name
      data.append("name", fileName)
      data.append("file", image)
      newPost.image = fileName
      console.log(newPost)
      try {
        dispatch(uploadImage(data))
      } catch (err) {
        console.log(err)
      }
    }
    dispatch(uploadPost(newPost))
    resetShare()
  }

  const resetShare = () => {
    setImage(null);
    desc.current.value = ""
  }

  return (
    <Container>
      <InputContainer>
        <Input
          type='text'
          placeholder='O que deseja publicar?'
          required
          ref={desc}
        />
        <ProfilePic src={
          user.profilePicture
            ? serverPublic + user.profilePicture
            : serverPublic + "defaultProfile.png"
        }
        />
      </InputContainer>
      <ShareContainer >
        <Option
          onClick={() => imageRef.current.click()}
        >
          <FaPhotoVideo style={{ color: 'blue' }} />
          <Span> Mídia </Span>
        </Option>
        <Option>
          <FaLocationArrow style={{ color: 'red' }} />
          <Span> Local </Span>
        </Option>
        <Option>
          <FaRegCalendarAlt style={{ color: 'green' }} />
          <Span> Data </Span>
        </Option>
        <Button
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Enviando" : "Enviar"}
        </Button>
      </ShareContainer>
      <div style={{ display: "none" }}>
        <input
          type="file"
          ref={imageRef}
          onChange={onImageChange}
        />
      </div>
      <PreviewContainer>
      {image && (
          <PreviewImage>
          <FaRegCalendarAlt onClick={() => setImage(null)} />
          <Img src={URL.createObjectURL(image)} alt="preview" />
        </PreviewImage>
      )}
      </PreviewContainer>
    </Container>
  )
}





/*

   {image && (
        <div className='previewImage'>
          <FaRegCalendarAlt onClick={() => setImage(null)} />
          <img src={URL.createObjectURL(image)} alt="preview" />
        </div>
      )}




      //


            <PreviewImage>
          <FaRegCalendarAlt onClick={() => setImage(null)} />
          <img src={URL.createObjectURL(image)} alt="preview" />
        </PreviewImage>

*/
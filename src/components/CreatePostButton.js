import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

class CreatePostButton extends Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });

    this.postForm
      .validateFields() //returns a Promise
      .then((form) => {
        const { description, uploadPost } = form;
        const { type, originFileObj } = uploadPost[0];
        const postType = type.match(/^(image|video)/g)[0];

        if (postType) {
          let formData = new FormData();
          formData.append("message", description);
          formData.append("media_file", originFileObj);

          const option = {
            method: "POST",
            url: `${BASE_URL}/upload`,
            headers: {
              Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            },
            data: formData,
          };

          axios(option)
            .then((res) => {
              if (res.status === 200) {
                message.success("upload successfully");
                this.postForm.resetFields();
                this.handleCancel();
                this.props.onShowPost(postType);
              }
            })
            .catch((err) => {
              message.error("something went wrong");
            })
            .finally(() => {
              this.setState({
                confirmLoading: false,
              });
            });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render(){
    const{visible,confirmLoading}=this.state;
    return <div>
        <Button type="primary" onClick={this.showModal}>
            Create New Post
        </Button>

        <Modal
            title="create new post"
            open={visible}
            onOk={this.handleOk}
            okText="Create"
            confirmLoading={confirmLoading}
            onCancel = {this.handleCancel}
        >
            <PostForm ref={(refInstance)=>{
                this.postForm = refInstance;
            }}/>
        </Modal>
    </div>
  }
}

export default CreatePostButton;

import React, { useState, useEffect } from "react";
import { Tabs, message, Col, Row } from "antd";
import axios from "axios";
import SearchBar from "./SearchBar";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";

import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";

const { TabPane } = Tabs;

const IMAGE = "image";
const VIDEO = "video";

const Collection = (props) => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState(IMAGE);
  const [searchOption, setSearchOption] = useState({
    type: SEARCH_KEY.all,
    keyword: "",
  });

  const handleSearch = (option) => setSearchOption(option);

  useEffect(() => {
    fetchPosts(searchOption);
  }, [searchOption]);

  const fetchPosts = (option) => {
    const { type, keyword } = option;
    let url = "";
    if (type === SEARCH_KEY.all) {
      url = `${BASE_URL}/search`;
    } else if (type === SEARCH_KEY.user) {
      url = `${BASE_URL}/search?user=${keyword}`;
    } else {
      url = `${BASE_URL}/search?keywords=${keyword}`;
    }

    const request_option = {
      method: "GET",
      url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    };

    axios(request_option)
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data);
        }
      })
      .catch(() => {
        message.error("sth went wrong");
      });
  };

  const renderPosts = (type) => {
    if (!posts || posts.length === 0) {
      return <div>no data</div>;
    }

    let filtered;

    if (type === IMAGE) {
      filtered = posts.filter((post) => post.type === IMAGE);
      if (!filtered || filtered.length === 0) {
        return <div>no images</div>;
      }

      const imageArr = filtered.map((image) => {
        return {
          postId: image.id,
          src: image.url,
          user: image.user,
          caption: image.message,
          thumbnail: image.url,
          thumbnailWidth: 300,
          thumbnailHeight: 200,
        };
      });

      return <PhotoGallery images={imageArr} />;
    } else if (type === VIDEO) {
      filtered = posts.filter((post) => post.type === VIDEO);
      if (!filtered || filtered.length === 0) {
        return <div>no video</div>;
      }

      return (
        <Row>
          {filtered.map((post) => (
            <Col span={24} key={post.url}>
              <video src={post.url} controls={true} className="video-block" />
            </Col>
          ))}
        </Row>
      );
    }
  };

  const showPost = (type) => {
    setActiveTab(type);

    setTimeout(() => {
      setSearchOption({
        type: SEARCH_KEY.all,
        keyword: "",
      });
    }, 3000);
  };

  return (
    <div className="home">
      <SearchBar handleSearch={handleSearch} />

      <div className="display">
        <Tabs
          onChange={(key) => setActiveTab(key)}
          defaultActiveKey={IMAGE}
          activeKey={activeTab}
          tabBarExtraContent={<CreatePostButton onShowPost={showPost} />}
        >
          <TabPane tab="Images" key={IMAGE}>
            {renderPosts(IMAGE)}
          </TabPane>

          <TabPane tab="Videos" key={VIDEO}>
            {renderPosts(VIDEO)}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Collection;

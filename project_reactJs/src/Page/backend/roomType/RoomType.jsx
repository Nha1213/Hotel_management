import { useState } from "react";
import "./roomType,.css";
import LightMode from "../DartMode/LightMode";
import { Modal, Form, Input, Button, Space, Row, Col } from "antd";

const RoomType = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard">
      <LightMode title="Room Type" />

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          + Add New Room Type
        </button>
      </div>

      <Modal
        title="Add New Room Type"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Room Type Name"
                name="roomType_Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter room type",
                  },
                ]}
              >
                <Input placeholder="Enter room type" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please enter description",
                  },
                ]}
              >
                <Input placeholder="Enter description" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button danger onClick={() => setOpen(false)}>
                Cancel
              </Button>

              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomType;

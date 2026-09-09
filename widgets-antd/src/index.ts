import { message as antdMessage, Modal } from "antd";

export { default as Button } from "./Button";
export { default as DatePicker } from "./DatePicker";
export { default as Input } from "./Input";
export { default as Segmented } from "./Segmented";
export { default as Select } from "./Select";
export { default as Spin } from "./Spin";
export { default as Switch } from "./Switch";
export { default as TextArea } from "./TextArea";
export { default as TimePicker } from "./TimePicker";

export const message = {
  success: (text: string) => antdMessage.success(text),
  error: (text: string) => antdMessage.error(text),
  warning: (text: string) => antdMessage.warning(text),
  info: (text: string) => antdMessage.info(text),
};

export const confirm = (message: string, callback: (ok: boolean) => void, props?: { title?: string; okText?: string; cancelText?: string }) => {
  Modal.confirm({
    title: "提示",
    content: message,
    ...props,
    onOk() {
      callback(true);
    },
    onCancel() {
      callback(false);
    },
  });
};

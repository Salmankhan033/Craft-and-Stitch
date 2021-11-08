import React from "react";
import { useFormikContext } from "formik";

import Button from "../Button";

function SubmitButton({ title,loading=false }) {
  const { handleSubmit } = useFormikContext();

  return <Button title={title} onPress={handleSubmit} loading={loading} />;
}

export default SubmitButton;

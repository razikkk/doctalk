import * as React from "react";
import { useState, useEffect } from "react";
import { styled, keyframes } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";

// Animation for flowing effect on the stepper line
const flowAnimation = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    backgroundSize: "200% 100%",
    backgroundImage:
      "linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    animation: `${flowAnimation} 2s infinite linear`,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({  }) => ({
  backgroundColor: "#157B7B", // Fixed color to prevent fading
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  transition: "background 1s ease-in-out",
}));

function ColorlibStepIcon(props: StepIconProps) {
  const icons: { [index: string]: React.ReactElement } = {
    1: <AdsClickIcon />,
    2: <QuestionAnswerIcon />,
    3: <NoteAltIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{}}>{icons[String(props.icon)]}</ColorlibStepIconRoot>
  );
}

const steps = ["Select a speciality", "Audio/ video call with a verified doctor", "Get a digital prescription & a free follow-up"];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const animateSteps = () => {
      setTimeout(() => setActiveStep(1), 1000);
      setTimeout(() => setActiveStep(2), 2000);
      setTimeout(() => setActiveStep(3), 3000);
    };

    animateSteps();
  }, []);

  return (
    <Stack sx={{ width: "100%", marginTop: "40px" }} spacing={4}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label, index) => (
          <Step key={label} completed={index < activeStep}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}

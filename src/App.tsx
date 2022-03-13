import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";

import {
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MailIcon from "@mui/icons-material/Mail";
import axios from "axios";

interface State {
  password: string;
  showPassword: boolean;
}

type Inputs = {
  username: string;
  password: string;
  email: string;
};

const defaultInput = {
  username: "",
  password: "",
  email: "",
};

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().min(8).max(32).required(),
    email: yup.string().email().required(),
  })
  .required();

function App() {
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formatData = {
      id: Math.floor(Math.random() * 10000 + 1),
      ...data,
    };
    try {
      const { data: postUserInfo } = await axios.post(
        "http://localhost:5000/accounts",
        formatData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      postUserInfo &&
        Swal.fire({
          title: "Success!",
          text: "Successfully Saved",
          icon: "success",
        });
      reset(defaultInput);
    } catch (e: any) {
      console.log(e.postUserInfo.message);
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="h1" marginTop={20} marginBottom={5}>
        React Hook Form
      </Typography>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl
          error={errors.username ? true : false}
          sx={{ width: "100%", marginBottom: 3 }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-username">
            Username
          </InputLabel>
          <OutlinedInput
            error={errors.username ? true : false}
            id="outlined-adornment-username"
            type={"text"}
            label="Username"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  disabled
                >
                  <PeopleAltIcon />
                </IconButton>
              </InputAdornment>
            }
            {...register("username")}
          />
          <Typography sx={{ color: "red" }} variant="body2" component="span">
            {errors.username?.message}
          </Typography>
        </FormControl>
        <FormControl
          error={errors.password ? true : false}
          sx={{ width: "100%", marginBottom: 3 }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            error={errors.password ? true : false}
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...register("password")}
          />
          <Typography sx={{ color: "red" }} variant="body2" component="span">
            {errors.password?.message}
          </Typography>
        </FormControl>
        <FormControl
          error={errors.email ? true : false}
          sx={{ width: "100%", marginBottom: 3 }}
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
          <OutlinedInput
            error={errors.email ? true : false}
            id="outlined-adornment-email"
            type={"email"}
            label="email"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  disabled
                >
                  <MailIcon />
                </IconButton>
              </InputAdornment>
            }
            {...register("email")}
          />
          <Typography sx={{ color: "red" }} variant="body2" component="span">
            {errors.email?.message}
          </Typography>
        </FormControl>
        <Button type={"submit"} variant="contained" fullWidth>
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default App;

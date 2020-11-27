import express from "express";

import { auth } from "../services";

const router = express.Router();

router
  .post('/sign-in', async (req, res) => {
    const { username, password } = req.body;

    try {
      const { refreshToken, authToken } = await auth.signInWithUsernameAndPassword(username, password);
      res.status(200).json({ success: true });
    } catch(error) {
      res.status(500).json({ error: true, ...error });
    }
  });

router
  .post('/sign-up', async (req, res) => {
    const {
      username,
      password,
      givenName,
      familyName,
      phoneNumber,
      birthdate,
      email,
    } = req.body;

    try {
      await auth.signUp({
        username,
        password,
        givenName,
        familyName,
        phoneNumber,
        birthdate,
        email,
      });
      res.status(200).json({ success: true });
    } catch(error) {
      res.status(500).json({ error: true, ...error });
    }
  });

router
  .post('/sign-up-confirm', async (req, res) => {
    const {
      username,
      confirmationCode,
    } = req.body;

    try {
      await auth.signUpConfirm({
        username,
        confirmationCode,
      });
      res.status(200).json({ success: true });
    } catch(error) {
      res.status(500).json({ error: true, ...error });
    }
  });

export default router;

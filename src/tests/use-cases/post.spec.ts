/* istanbul ignore file */
require("dotenv").config();
import { expect } from "chai";
import config from "../../app/config";
import { logger } from "../../app/libs/logger";
import { makeInputObj } from "../../app/component/entities";
import createPost from "../../app/component/use-cases/post";

// En mockad `get` funktion som efterliknar din verkliga `get` funktion
const mockGet = async ({ params }) => {
  // Anta att det här är det svar du förväntar dig från din `get` funktion
  return {
    username: params.username,
    email: params.email,
    // andra egenskaper som skulle returneras av din faktiska `get` funktion
  };
};

const mockFindDocuments = async () => [];
const mockInsertDocument = async ({ document }) => document;

// Skapa en post-funktion som använder den mockade `get` funktionen
const post = createPost({
  makeInputObj,
  insertDocument: mockInsertDocument,
  findDocuments: mockFindDocuments,
  get: mockGet, // Använd den mockade `get` funktionen här
  logger,
});

// Dina dbConfig och errorMsgs
const dbConfig = config.DB_CONFIG;
const errorMsgs = config.ERROR_MSG.post;

describe("Post Use Case", () => {
  // Testfall för att infoga en användare
  it("should insert a user", async () => {
    const params = {
      username: "testuser",
      password: "password123",
      email: "test@example.com",
    };
    const results = await post.post({ params, dbConfig, errorMsgs });
    expect(results).to.have.property("username").equal(params.username);
    // andra förväntningar baserade på den mockade `get` funktionens respons
  });

  // Fler testfall...
});

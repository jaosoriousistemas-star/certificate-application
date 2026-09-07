// Import the Router class from Express
import { Router } from "express";

// Import the Services Routes for handle services related-routes
import academicLevelRouter from "./academicLevelRouter.js";
import genderRouter from "./genderRouter.js";
import roleRouter from "./roleRouter.js";
import documentTypeRouter from "./documentTypeRouter.js";
import gradeRouter from "./gradeRouter.js";
import institutionRouter from "./institutionRouter.js";
import groupRouter from "./groupRouter.js";
import countryRouter from "./countryRouter.js";
import departmentRouter from "./departmentRouter.js";
import municipalityRouter from "./municipalityRouter.js";
import userRouter from "./userRouter.js";
import phoneRouter from "./phoneRouter.js";
import studentRouter from "./studentRouter.js";


// Function to set up API routes
const routerApi = (app) => {

  // Create a new Router instance
  const router = Router();

  // Use the router instance for the '/app/v1' path
  app.use('/app/v1', router);

  // Catalog of the sub-routes
  router.use('/academic-levels', academicLevelRouter);
  router.use('/genders', genderRouter);
  router.use('/roles', roleRouter);
  router.use('/document-types', documentTypeRouter);
  router.use('/grades', gradeRouter);
  router.use('/institutions', institutionRouter);
  router.use('/groups', groupRouter);
  router.use('/countries', countryRouter);
  router.use('/departments', departmentRouter);
  router.use('/municipalities', municipalityRouter);
  router.use('/users', userRouter);
  router.use('/phones', phoneRouter);
  router.use('/students', studentRouter);
}

// Export the routerApi function for use in other parts of the application
export default routerApi;

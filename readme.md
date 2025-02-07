# Technology stack

## Languages and frameworks

* Flask
  * I chose Flask for speed as I only need what the microframework offers
* ButterCMS
  * A CMS for Flask
* React
  * Advanced frontend features
* Python
* HTML5
* CSS3
* JavaScript

## Packages and extensions

* python-dotenv 
  * Allows you to set enviroment variables in root .env.py
* flask_restful
* Thunder client - To test restful endpoints

# Design

## User stories

### Visitor Stories

* As a Visitor, I want to see featured projects immediately on the landing page, so I can quickly assess the developer's capabilities.
* As a Visitor, I want to filter projects by technology/skill, so I can find relevant work samples.
* As a Visitor, I want to click on project cards to see:
  - Detailed description
  - Technologies used
  - Live demo link
  - GitHub repository link
  - Screenshots/preview

### Admin Stories

* As an admin, I want to access a secure dashboard via login, so I can manage portfolio content.
* As an admin, I want to perform CRUD operations on projects:
  - Create new projects with title, description, image, links
  - Update existing project details
  - Delete projects
  - Reorder projects' display position
  
# Project Plan

## Sprint 1: Project Setup & Basic Structure
- Create Figma design
- Initialize React frontend
- Set up Python/Flask backend
- Configure database
- Create basic project structure

## Sprint 2: Backend Development
- Create Flask models for projects
- Set up REST API endpoints
- Create admin dashboard structure
- Add admin login
- Configure CORS and security settings

## Sprint 3: Core Frontend
- Create landing page structure
- Build project card components
- Create responsive navigation for porfolio
- Add basic styling

## Sprint 4: Project Management Features
- Implement CRUD operations for projects
- Add image upload functionality
- Create project skill filtering system
- Add project category management
- Implement project ordering feature

## Sprint 5: Frontend
- Style landing page
- Set up React Router for project details
- Create project details page
- Style project details page

## Sprint 6: Polish & Testing
- Add loading states/tranisitons and error handling
- Finish documentation
- Performance optimization
- Bug fixes and refinements

## Sprint 7: Deployment & Launch
- Set up production environment
- Final manual testing
- Finalize documentation

## Enitity relationship diagram

[View ERD on lucidchart](https://lucid.app/lucidchart/fc35cf54-f85c-4fa3-a637-8f530bfa80d1/edit?viewport_loc=-617%2C-101%2C2399%2C1058%2C0_0&invitationId=inv_0e8624ce-216d-4796-a3dd-6dde92d8ba15)

### ERD explained

#### Project

Contains the columns for each project.

* id - primary key
* title 
* description
* live_url - Link to the live project
* github_url
* image_url - Link to where the image is stored.

#### Project colour scheme

Contains the project's colour scheme for frontend styling.
Colours stored as hex values.
Has a one-to-one relationship with a project.

Foreign key is in the 

* id - primary key
* project_id - foreign key
* primary_colour
* secondary_colour
* text_colour

#### Skill tags

Contains each skill tags name.

* id - primary key
* name - UNIQUE

### Project_tag

Links a project with skills, creating a one-to-many relationship.

* id - primary key for indexing
* project_id - foreign key
* skill_tag_id - foreign key

project_id + skill_tag_id has unique contraint

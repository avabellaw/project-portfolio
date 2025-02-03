# Languages and frameworks

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

# Packages

* python-dotenv 
  * Allows you to set enviroment variables in root .env.py
* flask_restful

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
- Set up development environment
- Configure environment variables

## Sprint 2: Core Frontend
- Implement landing page
- Build project card components
- Create responsive navigation for porfolio
- Add basic styling and animations
- Set up React Router

## Sprint 3: Backend Development
- Create Flask models for projects
- Set up REST API endpoints
- Implement authentication system
- Create admin dashboard structure
- Configure CORS and security settings

## Sprint 4: Project Management Features
- Implement CRUD operations for projects
- Add image upload functionality
- Create project skill filtering system
- Add project category management
- Implement project ordering feature

## Sprint 5: Polish & Testing
- Add loading states/tranisitons and error handling
- Finish documentation
- Performance optimization
- Bug fixes and refinements

## Sprint 6: Deployment & Launch
- Set up production environment
- Final manual testing
- Finalize documentation
# Additional Endpoints

I created the endpoints for creating, updating and deleting out of interest.

React only needs to use GET requests, the admin panel handles the rest of the CRUD functionality.

## Projects endpoint

To add projects.

<details>
<summary>POST Request</summary>

```python

@marshal_with(project_fields)
    def post(self):
        '''Create a new project'''
        args = project_parser.parse_args()
        project = ProjectModel(title=args['title'],
                            description=args['description'],
                            live_url=args['live_url'],
                            github_url=args['github_url'],
                            image_url='TEMPORARY IMAGE URL')
        db.session.add(project)
        db.session.flush()

        colour_scheme = ColourSchemeModel(
            project_id=project.id,
            primary_colour=args['primary_colour'],
            secondary_colour=args['secondary_colour'],
            text_colour=args['text_colour']
        )
        db.session.add(colour_scheme)

        if args['skills']:
            for skill_id in args['skills']:
                skill = db.session.get(SkillModel, skill_id)
                if skill:
                    project_skill = ProjectSkillModel(project_id=project.id,
                                                    skill_id=skill.id)
                    db.session.add(project_skill)
                else:
                    abort(404, message=f'Skill ID:{skill_id} not found')

        db.session.commit()
        return project, 201
```

</details>

## Project endpoint

To update or delete a project.

<details>

<summary>PUT Request</summary>

```python

@marshal_with(project_fields)
def put(self, project_id):
    '''Update a project'''
    project = db.session.get(ProjectModel, project_id)
    if not project:
        abort(404, message='Project not found')
    args = project_parser.parse_args()
    project.title = args['title']
    project.description = args['description']
    project.live_url = args['live_url']
    project.github_url = args['github_url']
    project.image_url = 'TEMPORARY IMAGE URL'

    colour_scheme = project.colour_scheme
    colour_scheme.primary_colour = args['primary_colour']
    colour_scheme.secondary_colour = args['secondary_colour']
    colour_scheme.text_colour = args['text_colour']
    db.session.commit()

    return project

```

</details>

<details>
<summary>DELETE Request</summary>

```python 

def delete(self, project_id):
    '''Delete a project'''
    project = db.session.get(ProjectModel, project_id)
    if not project:
        abort(404, message='Project not found')
    db.session.delete(project)
    db.session.commit()
    return '', 204

```
</details>

## Skills Endpoint

To add a skills.

<details>
<summary>POST Request</summary>

```python 

@marshal_with(skill_fields)
def post(self):
    '''Create a new skill'''
    args = skill_parser.parse_args()
    try:
        skill = SkillModel(name=args['name'])

        db.session.add(skill)
        db.session.commit()

        return skill, 201
    except IntegrityError:
        # Violates unique constraint
        abort(400, message='Skill already exists')

```
</details>

## Skill Endpoint

To update or delete a skill.

<details>
<summary>PUT Request</summary>

```python 

@marshal_with(skill_fields)
def put(self, skill_id):
    skill = db.session.get(SkillModel, skill_id)
    if not skill:
        abort(404, message='Skill not found')
    args = skill_parser.parse_args()
    skill.name = args['name']
    db.session.commit()
    return skill

```
</details>


<details>
<summary>DELETE Request</summary>

```python 

def delete(self, skill_id):
    skill = db.session.get(SkillModel, skill_id)
    if not skill:
        abort(404, message='Skill not found')
    db.session.delete(skill)
    db.session.commit()
    return '', 204

```
</details>

## ProjectSkill Endpoint

To add or remove skills from projects.

<details>
<summary>POST Request</summary>

```python 


@marshal_with(project_fields)
def post(self, project_id, skill_id):
    '''Add a skill to a project'''
    project = db.session.get(ProjectModel, project_id)

    if not project:
        abort(404, message='Project not found')

    skill = db.session.get(SkillModel, skill_id)
    if not skill:
        abort(404, message='Skill not found')

    project_name = project.title
    skill_name = skill.name

    try:
        project_skill = ProjectSkillModel(project_id=project.id,
                                            skill_id=skill.id)
        db.session.add(project_skill)
        db.session.commit()
        return project, 201
    except IntegrityError:
        # Violates unique constraint
        abort(400,
                message=f"'{skill_name}' already a skill "
                f"for project '{project_name}'")


```
</details>

<details>
<summary>DELETE Request</summary>

```python 

@marshal_with(project_fields)
def delete(self, project_id, skill_id):
    '''Delete a skill from a project'''
    project = db.session.get(ProjectModel, project_id)

    if not project:
        abort(404, message='Project not found')

    skill = db.session.get(SkillModel, skill_id)
    if not skill:
        abort(404, message='Skill not found')

    project_skill = db.session.query(ProjectSkillModel).filter_by(
        project_id=project.id, skill_id=skill.id).first()

    if not project_skill:
        abort(404, message='Skill not found for project')

    db.session.delete(project_skill)
    db.session.commit()
    return '', 204

```
</details>
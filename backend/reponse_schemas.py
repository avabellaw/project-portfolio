from flask_restful import fields

colour_scheme_fields = {
    'primary_colour': fields.String,
    'secondary_colour': fields.String,
    'text_colour': fields.String,
    'text_highlight_colour': fields.String
}

skill_fields = {
    'id': fields.Integer,
    'name': fields.String
}

project_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'description': fields.String,
    'live_url': fields.String,
    'github_url': fields.String,
    'image_url': fields.String,
    'colour_scheme': fields.Nested(colour_scheme_fields),
    'skills': fields.List(fields.Nested(skill_fields))
}

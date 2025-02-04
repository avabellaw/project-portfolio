# import werkzeug
from flask_restful import reqparse


# Request parsers
project_parser = reqparse.RequestParser()
project_parser.add_argument('title', type=str, required=True,
                            help='Project title is required')
project_parser.add_argument('description', type=str, required=True,
                            help='Project description is required')
project_parser.add_argument('live_url', type=str, required=True,
                            help='Live URL is required')
project_parser.add_argument('github_url', type=str, required=True,
                            help='GitHub URL is required')
project_parser.add_argument('primary_colour', type=str, required=True,
                            help='Primary colour is required')
project_parser.add_argument('secondary_colour', type=str, required=True,
                            help='Secondary colour is required')
project_parser.add_argument('text_colour', type=str, required=True,
                            help='Text colour is required')
# project_parser.add_argument('image',
#                             type=werkzeug.datastructures.FileStorage,
#                             location='files')

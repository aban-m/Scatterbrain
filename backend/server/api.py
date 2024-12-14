from flask import Blueprint, request

print(__name__)
bp = Blueprint('api', 'api')


@bp.route('/')
def root():
	return '<h1>Backend server running.</h1>'

@bp.route('/echo')
def echo():
	# get the json of the request
	
	return {
		'echo': request.json['text'].upper()
	}
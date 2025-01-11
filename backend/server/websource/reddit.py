import re
import os
import praw
import dotenv
from praw.models import Comment

dotenv.load_dotenv()

ptn = re.compile('comments?/([a-zA-Z0-9]+)/?')

reddit = praw.Reddit(
    client_id = os.environ['REDDIT_ID'],
    client_secret = os.environ['REDDIT_SECRET'],
    user_agent = 'scatterbrain / 1.0'
)


def extract_targets(url) -> list:
    ''' Return all relevant submission IDs in a URL '''
    return ptn.findall(url)

def fetch_comments(cf, limit : int, method: str = 'bfs'):
    ''' Returns a flattened list of comments, stopping at the limit '''
    res: list[Comment]= []
    
    if method != 'bfs':
        raise NotImplementedError('Only breadth-first traversal is currently supported.')

    cf.replace_more(limit = limit) 
    for comment in cf.list():
        res.append(comment)
        limit -= 1
        if not limit: break
    
    return res

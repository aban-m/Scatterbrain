import re
import os
import praw
import dotenv
from praw.models import Comment
from praw.models.comment_forest import CommentForest

dotenv.load_dotenv()

ptn = re.compile("comments?/([a-zA-Z0-9]+)/?")

reddit_client = praw.Reddit(
    client_id=os.environ["REDDIT_ID"],
    client_secret=os.environ["REDDIT_SECRET"],
    user_agent="scatterbrain / 1.0",
)


def validate_url(url) -> None:
    """Raises an error in case of bad URL."""

    return True


def extract_targets(url) -> list:
    """Return all relevant submission IDs in a URL, currnetly obsolete"""
    return ptn.findall(url)


def fetch_comments(cf: CommentForest, limit: int, method: str = "bfs"):
    """Returns a flattened list of comments, stopping at the limit"""
    res: list[Comment] = []

    if method != "bfs":
        raise NotImplementedError(
            "Only breadth-first traversal is currently supported."
        )

    cf.replace_more(limit=limit)
    for comment in cf.list():
        if not isinstance(comment, Comment):
            # should not really happen
            continue
        res.append(comment)
        limit -= 1
        if not limit:
            break

    return res


def ingest(url: str, limit: int) -> list[str]:
    validate_url(url)
    post = reddit_client.submission(url=url)
    return [cmt.body for cmt in fetch_comments(post.comments, limit)]

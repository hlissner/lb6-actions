#!/usr/bin/env python

import base64
import mimetypes
import os
import sys
import json

class FileNotFoundError(Exception):
    pass

def img_to_data(path):
    """Convert a file (specified by a path) into a data URI."""
    if not os.path.exists(path):
        raise FileNotFoundError
    mime, _ = mimetypes.guess_type(path)
    with open(path, 'rb') as fp:
        data = fp.read()
        data64 = u''.join(base64.encodestring(data).splitlines())
        return u'data:%s;base64,%s' % (mime, data64)

items = []
for argv in sys.argv[1:]:
    try:
        data = img_to_data(argv)
        item = {}
        item['title'] = data
        item['subtitle'] = argv
        item['actionArgument'] = data
        item['quickLookURL'] = 'file://'+argv

        items.append(item)
    except FileNotFoundError:
        items.append({"title": "File not found."});

print(json.dumps(items))

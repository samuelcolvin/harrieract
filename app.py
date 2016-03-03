import json
import logging
from aiohttp import web
from aiohttp.log import access_logger

handler = logging.StreamHandler()
access_logger.addHandler(handler)
access_logger.setLevel(logging.INFO)


async def comments_handler(request):
    if request.method == 'POST':
        data = await request.post()
        index = request.app['data'][-1]['id'] + 1
        request.app['data'].append(dict(id=index, **data))
    body = json.dumps(request.app['data']).encode('utf8')
    return web.Response(body=body, content_type='application/javascript')


app = web.Application()

app.router.add_route('*', '/comments', comments_handler)
app['data'] = [
  {'id': 1, 'author': 'Pete Hunt', 'text': 'This is one comment'},
  {'id': 2, 'author': 'Jonny Walker', 'text': 'This is **another** comment'},
]

async def on_prepare(request, response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8000'
app.on_response_prepare.append(on_prepare)

# web.run_app(app, port=8001)

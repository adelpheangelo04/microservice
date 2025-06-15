from fastapi import HTTPException, Request
from httpx import AsyncClient, ConnectError, TimeoutException
from fastapi.responses import Response


async def forward_request(service_url: str, path: str, request: Request):
    url = f"{service_url}{path}"

    headers = {
        key: value for key, value in request.headers.items()
        if key.lower() in ("authorization", "content-type", "accept")
    }

    try:
        async with AsyncClient(follow_redirects=True) as client:  # ⬅️ follow_redirects ajouté
            response = await client.request(
                method=request.method,
                url=url,
                content=await request.body(),
                params=request.query_params,
                headers=headers
            )

        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )

    except (ConnectError, TimeoutException) as e:
        raise HTTPException(status_code=503, detail=f"Service indisponible : {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne : {str(e)}")
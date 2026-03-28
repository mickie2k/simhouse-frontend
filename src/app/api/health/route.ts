export async function GET() {
    try {
        return Response.json(
            {
                status: "OK",
                service: "simhouse-frontend",
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
            { status: 200 },
        );
    } catch (error) {
        return Response.json(
            {
                status: "ERROR",
                service: "simhouse-frontend",
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

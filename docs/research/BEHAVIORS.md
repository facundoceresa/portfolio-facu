# Reference Behaviors

Source: https://core-composition.lovable.app/

Browser automation: Playwright local. `chrome-devtools` MCP was detected but returned `Target closed`.

## Scroll Samples

- y=0: header={"rect":{"x":0,"y":0,"width":1440,"height":69,"top":0,"right":1440,"bottom":69,"left":0},"backgroundColor":"oklab(0.217683 -0.0113979 -0.0336839 / 0.85)","backdropFilter":"blur(24px)","borderBottom":"1px solid oklab(0.777999 -0.143017 0.025884 / 0.1)","boxShadow":"none","transform":"none","transition":"all"}
- y=120: header={"rect":{"x":0,"y":-120,"width":1440,"height":69,"top":-120,"right":1440,"bottom":-51,"left":0},"backgroundColor":"oklab(0.217683 -0.0113979 -0.0336839 / 0.85)","backdropFilter":"blur(24px)","borderBottom":"1px solid oklab(0.777999 -0.143017 0.025884 / 0.1)","boxShadow":"none","transform":"none","transition":"all"}
- y=600: header={"rect":{"x":0,"y":-600,"width":1440,"height":69,"top":-600,"right":1440,"bottom":-531,"left":0},"backgroundColor":"oklab(0.217683 -0.0113979 -0.0336839 / 0.85)","backdropFilter":"blur(24px)","borderBottom":"1px solid oklab(0.777999 -0.143017 0.025884 / 0.1)","boxShadow":"none","transform":"none","transition":"all"}
- y=1200: header={"rect":{"x":0,"y":-1200,"width":1440,"height":69,"top":-1200,"right":1440,"bottom":-1131,"left":0},"backgroundColor":"oklab(0.217683 -0.0113979 -0.0336839 / 0.85)","backdropFilter":"blur(24px)","borderBottom":"1px solid oklab(0.777999 -0.143017 0.025884 / 0.1)","boxShadow":"none","transform":"none","transition":"all"}
- y=2400: header={"rect":{"x":0,"y":-2400,"width":1440,"height":69,"top":-2400,"right":1440,"bottom":-2331,"left":0},"backgroundColor":"oklab(0.217683 -0.0113979 -0.0336839 / 0.85)","backdropFilter":"blur(24px)","borderBottom":"1px solid oklab(0.777999 -0.143017 0.025884 / 0.1)","boxShadow":"none","transform":"none","transition":"all"}
- y=4200: header={"rect":{"x":0,"y":-4200,"width":1440,"height":69,"top":-4200,"right":1440,"bottom":-4131,"left":0},"backgroundColor":"oklab(0.217683 -0.0113979 -0.0336839 / 0.85)","backdropFilter":"blur(24px)","borderBottom":"1px solid oklab(0.777999 -0.143017 0.025884 / 0.1)","boxShadow":"none","transform":"none","transition":"all"}
- y=6400: header={"rect":{"x":0,"y":-6400,"width":1440,"height":69,"top":-6400,"right":1440,"bottom":-6331,"left":0},"backgroundColor":"oklab(0.217683 -0.0113979 -0.0336839 / 0.85)","backdropFilter":"blur(24px)","borderBottom":"1px solid oklab(0.777999 -0.143017 0.025884 / 0.1)","boxShadow":"none","transform":"none","transition":"all"}

## Required follow-up

- Re-run visual comparison against implementation at all six specified viewports.
- Mask cursor/flicker animations before enforcing the 5% global threshold.
- Validate hover/click states after implementation with Playwright E2E.
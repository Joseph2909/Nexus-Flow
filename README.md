# NexusFlow

A lightweight visual workflow builder built with React, Vite, React Router, and React Flow.

## Run locally

```sh
npm install
npm run dev
```

## Using the app

- Visit `/` for the workspace overview and `/canvas` to edit a flow.
- The canvas starts with a sample Turbine Sensor -> Moving Average -> SMS Alert workflow.
- Drag a Data Source, Math Operation, or Action Trigger from the node library onto the canvas, or click a node to add it in the center.
- Move nodes by dragging them. Connect compatible steps by dragging from a node's output handle to another node's input handle.
- Use the canvas controls to zoom and pan, and Reset to restore the starter flow.

Run `npm run build` to create a production build.
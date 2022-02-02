# 3. Use Azure Pipelines for Windows builds

Date: 2019-09-06

## Status

Accepted

## Context

We're currently manually building the Windows version of the application due to no out of the box support from AppCenter.

## Decision

Utilize Azure Pipelines and their windows agents to build the Windows variant of the kiosk.

## Consequences

We need to depend on Azure Pipelines (see documentation: https://docs.microsoft.com/en-gb/azure/devops/pipelines/)

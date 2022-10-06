# Create Faction

## Lifecycle

### Unvalidated state

data UnvalidatedFaction =
UnvalidatedName

### Validated state

data ValidatedFaction =
ValidatedName unique string less than 50char
id UUID

## Output events

FactionCreated

## Processes

process CreateFaction =
input: UnvalidatedFaction
output (success): FactionCreated
output (error): CreateFactionError

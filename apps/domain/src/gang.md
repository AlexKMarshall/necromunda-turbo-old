# Gang

## Lifecycle

### Unvalidated state

data UnvalidatedGang =
UnvalidatedName
AND UnvalidatedFaction
AND list of UnvalidatedFighter

data UnvalidatedFighter =
UnvalidatedName
AND UnvalidatedFighterType
AND list of UnvalidatedWeapon

data UnvalidatedWeapon

### Validated state

data ValidatedGang =
ValidatedName string lt 50char
AND ValidatedFaction
AND list of ValidatedFighters at least one leader and at least 50% gang fighters

### Priced state

data PricedGang =
ValidatedName
AND ValidatedFaction
AND list of PricedFighters
AND LeftoverStash

### Output events

data GangAcknowledgementSent
data GangFounded

## Processes

process foundGang =
input: UnvalidatedGang
output (on success): GangAcknowledgementSent
GangFounded
output (on error): FoundGangError

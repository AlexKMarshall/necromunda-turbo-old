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
ValidatedName
AND ValidatedFaction
AND list of ValidatedFighters

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
output (on error): InvalidGang

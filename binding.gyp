{
	"variables": {
		"jsdr_routine_sources": [
			"lib/addon/jsdr.cc"
		]
	},
	"targets": [
		{
			"target_name":       "jsdr-routines",
			"product_extension": "node",
			"type":              "shared_library",
			"sources":           ["<@(jsdr_routine_sources)"],
			"include_dirs":      ["<!(node -e \"require('nan')\")"]
		}
	]
}

package cmd

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/spf13/cobra"
)

var getCmd = &cobra.Command{
	Use:   "get [message Id]",
	Short: "Get a message details",
	Long:  "Get  a message details with the provided id",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 {
			return errors.New("requires a message ID to get the details")
		}
		return nil
	},
	Run: getMessage,
}

func init() {
	RootCmd.AddCommand(getCmd)
}

func getMessage(cmd *cobra.Command, args []string) {
	msg, err := rClient.GetMessage(args[0])
	if err != nil {
		fmt.Println("Cannot get the details.", err)
		return
	}
	b, _ := json.MarshalIndent(msg, "", " ")
	fmt.Println(string(b))

}

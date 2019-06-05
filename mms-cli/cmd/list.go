package cmd

import (
	"encoding/json"
	"fmt"

	"github.com/spf13/cobra"
)

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all the message",
	Long:  "List all the message details of the server",
	Run:   listMessages,
}

func init() {
	RootCmd.AddCommand(listCmd)
}

func listMessages(cmd *cobra.Command, args []string) {
	msgs, err := rClient.ListMessages()
	if err != nil {
		fmt.Println("Cannot get the list of messages.", err)
		return
	}
	b, _ := json.MarshalIndent(msgs, "", " ")
	fmt.Println(string(b))

}

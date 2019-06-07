package cmd

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var page, limit int
var palindrome string

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all the message",
	Long:  "List all the message details of the server",
	Run:   listMessages,
}

func init() {
	RootCmd.AddCommand(listCmd)
	listCmd.Flags().IntVarP(&page, "page", "p", 1, "Starting page of the listing, default 1")
	listCmd.Flags().IntVarP(&limit, "limit", "l", 3, "Number of entries per-page, default 3")
	listCmd.Flags().StringVarP(&palindrome, "palindrome", "d", "", "Whether show only palindrome or non-palindrome(true/false), default no filter")
}

func listMessages(cmd *cobra.Command, args []string) {
	if palindrome != "" {
		if palindrome != "true" && palindrome != "false" {
			fmt.Println("Invalid value for palindrome, allowed values only [true/false]")
			os.Exit(1)
		}
	}
	msgs, err := rClient.ListMessagesWithAllFilter(page, limit, &palindrome)
	if err != nil {
		fmt.Println("Cannot get the list of messages.", err)
		return
	}
	b, _ := json.MarshalIndent(msgs, "", " ")
	fmt.Println(string(b))

}
